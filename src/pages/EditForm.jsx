import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Categorize from "../components/admin-questions/Categorize.jsx";
import Cloze from "../components/admin-questions/Cloze.jsx";
import Comprehension from "../components/admin-questions/Comprehension.jsx";
import Input from "../components/custom/Input.jsx";

import AddSvg from "../components/svgs/AddSvg";
import CopySvg from "../components/svgs/CopySvg";
import DeleteSvg from "../components/svgs/DeleteSvg";
import ImageSvg from "../components/svgs/ImageSvg";
import CloseSvg from "../components/svgs/CloseSvg";
import LoadingSvg from "../components/svgs/LoadingSvg";

import { axiosOpen } from "../utils/axios.js";
import { isValidBool } from "../utils/support.js";

const EditForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    formName: "",
    headerImageURL: "",
    headerImageFile: "",
  });
  const [questions, setQuestions] = useState([]);
  const [deletedQuestions, setDeletedQuestions] = useState([]);

  const [query, setQuery] = useState(true);
  const { isLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: async () => {
      const { data } = await axiosOpen.get(`/forms/${formId}`);
      setQuery(false);

      setData((prev) => ({
        ...prev,
        formName: data?.data?.formName,
        headerImageURL: data?.data?.headerImage,
      }));

      setQuestions([...(data?.data?.questions || [])]);

      return data?.data;
    },
    enabled: query,
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => {
      let errors = { questions: [] };
      errors.formName = !isValidBool(data.formName);

      if (!questions.length)
        throw {
          ...errors,
          response: { data: { message: "Add atleast one question!" } },
        };

      let filteredQuestions = [];

      questions.forEach((que, index) => {
        let queErrors = {
          points: !isValidBool(que.points),
        };
        let filteredQuestion = {
          type: que.type,
          points: que.points,
          imageUrl: que?.imageUrl || "",
        };
        if (que?._id) filteredQuestion._id = que._id;

        if (que.type === "categorize") {
          queErrors.categories = [
            que.categories.filter((c) => c.trim()).length ? false : true,
          ];

          queErrors.itemsWithBelongsTo = que.itemsWithBelongsTo?.filter((a) =>
            a?.item?.trim()
          )?.length
            ? que.itemsWithBelongsTo.map(
                (a) =>
                  (a?.item?.trim() && !a?.belongsTo?.trim()) ||
                  (!a?.item?.trim() && a?.belongsTo?.trim())
              )
            : [true];

          filteredQuestion.categories = que.categories.filter((c) => c.trim());

          filteredQuestion.itemsWithBelongsTo = que.itemsWithBelongsTo.filter(
            (a) => a?.item?.trim() && a?.belongsTo?.trim()
          );

          filteredQuestion.description = que?.description || "";
        } else if (que.type === "cloze") {
          queErrors.sentence = !isValidBool(
            que.sentence?.replace("<p>", "").replace("</p>", "")
          );

          queErrors.options = [
            que.options.filter((c) => c.trim()).length ? false : true,
          ];

          filteredQuestion.sentence = que.sentence
            ?.replace("<p>", "")
            ?.replace("</p>", "")
            ?.trim();

          filteredQuestion.sentenceWithBlanks = que.sentence
            ?.replace("<p>", "")
            ?.replace("</p>", "")
            ?.replace(/<u>(.*?)<\/u>/g, "<u></u>")
            ?.trim();

          filteredQuestion.options = que.options.filter((c) => c.trim());
        } else if (que.type === "comprehension") {
          queErrors.passage = !isValidBool(que.passage);

          queErrors.mcqs = que?.mcqs?.map((mcq) => ({
            question: !isValidBool(mcq.question),
            options: [
              mcq.options.filter((c) => c.trim()).length ? false : true,
            ],
          }));

          filteredQuestion.passage = que?.passage?.trim();

          filteredQuestion.mcqs = que?.mcqs?.map((mcq) => ({
            question: mcq?.question?.trim(),
            options: mcq?.options?.filter((c) => c?.trim()),
            answer: Number(mcq?.answer),
          }));
        }

        errors.questions[index] = queErrors;
        filteredQuestions[index] = filteredQuestion;
      });

      if (/true/.test(JSON.stringify(errors)))
        throw {
          ...errors,
          response: { data: { message: "Fill all required fields" } },
        };

      const formData = new FormData();

      formData.append("formName", data.formName);
      if (data.headerImageFile)
        formData.append(
          "headerImage",
          data.headerImageFile,
          `${formId}-headerImage`
        );

      formData.append("questions", JSON.stringify([...filteredQuestions]));
      formData.append(
        "deletedQuestions",
        JSON.stringify([...deletedQuestions])
      );

      questions.forEach((question, index) => {
        if (question.imageFile) {
          const ext = question.imageFile.name.split(".").pop();
          formData.append(
            "questionsImages",
            question.imageFile,
            `${formId}-${index}.${ext}`
          );
        }
      });

      return axiosOpen.patch(`/forms/${formId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Form updatation successful!");
      navigate("/forms", { replace: true });
    },
    onError: (err) => {
      console.log(err);
      toast.error(
        err?.response?.data?.message || "Something went wrong, Retry!"
      );
    },
  });

  const addQuestion = (type) => {
    let obj = { type, points: undefined, imageURL: "", imageFile: "" };
    if (type === "categorize") {
      obj = {
        ...obj,
        description: "",
        categories: [""],
        itemsWithBelongsTo: [{ item: "", belongsTo: "" }],
      };
    } else if (type === "cloze") {
      obj = { ...obj, sentence: "", options: [""] };
    } else if (type === "comprehension") {
      obj = {
        ...obj,
        passage: "",
        mcqs: [
          {
            question: "",
            options: [""],
            answer: 1,
          },
        ],
      };
    }
    setQuestions((prev) => [...prev, obj]);
  };

  const copyQuestion = (idx) => {
    setQuestions((prev) => {
      let queToCopy = { ...prev[idx] };
      if (queToCopy?._id) delete queToCopy._id;
      return [
        ...prev.slice(0, idx + 1),
        { ...queToCopy },
        ...prev.slice(idx + 1),
      ];
    });
  };

  const removeQuestion = (idx) => {
    setQuestions((prev) => [
      ...prev.filter((que, i) => {
        if (i === idx) {
          if (que?._id)
            setDeletedQuestions((prev) => [
              ...prev,
              { _id: que._id, type: que.type },
            ]);
          return false;
        }
        return true;
      }),
    ]);
  };

  const removeHeaderImage = () => {
    setData((prev) => ({ ...prev, headerImageFile: "", headerImageURL: "" }));
  };

  const handleChangeForm = (e) => {
    if (e.target.id !== "image")
      return setData((prev) => ({
        ...prev,
        [e.target.id]: e.target.value,
      }));
    if (
      e.target.files[0]?.type === "image/jpeg" ||
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpg"
    ) {
      setData((prev) => ({
        ...prev,
        headerImageURL: URL.createObjectURL(e.target.files[0]),
        headerImageFile: e.target.files[0],
      }));
    } else {
      setData((prev) => ({
        ...prev,
        headerImageURL: "",
        headerImageFile: "",
      }));
      e.target.value = null;
    }
  };

  if (isLoading)
    return (
      <div className="grid place-content-center h-[calc(100vh-80px)]">
        <div className="font-extrabold text-xl">Loading...</div>
      </div>
    );

  return (
    <section className="p-10 pt-7 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-end border-b border-solid border-b-neutral-300 p-1">
        <h2 className="font-extrabold text-2xl">Edit Form</h2>

        <div>
          <div className="inline-block">
            <button
              onClick={mutate}
              disabled={isPending}
              className="bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-700 text-white py-2 px-4 rounded-lg font-bold me-1"
            >
              {isPending ? (
                <>
                  <LoadingSvg className="animate-spin invert w-5 inline-block me-2 mb-[2px]" />
                  Processing...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
          <div className="inline-block">
            <button
              className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg font-bold"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <Input
          type="text"
          id="formName"
          placeholder="Form Name*"
          value={data.formName}
          onChange={handleChangeForm}
          size="lg"
          isInvalid={error?.formName}
        />
      </div>

      <div className="mt-2 cursor-pointer rounded-md bg-neutral-300 h-56 relative flex justify-center items-center">
        <input
          type="file"
          accept="image/*"
          id="image"
          className="opacity-0 w-full h-56 absolute top-0 left-0 z-10 cursor-pointer"
          onChange={handleChangeForm}
        />
        {data.headerImageURL ? (
          <>
            <img
              src={data.headerImageURL}
              alt="headerImage"
              className="w-full h-full rounded-md object-contain"
            />
            <div
              className="w-5 absolute top-2 right-2 z-10"
              onClick={removeHeaderImage}
            >
              <CloseSvg />
            </div>
          </>
        ) : (
          <div className="font-bold text-neutral-600 text-lg text-center">
            <div className="w-8 mx-auto opacity-70">
              <ImageSvg />
            </div>
            Upload header image
            <p className="text-xs">(Upload jpg, jpeg, png only.)</p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="p-1 flex items-end justify-between border-b border-solid border-neutral-300">
          <h3 className="text-lg font-bold">Questions</h3>
          <div className="relative group">
            <button className="py-1 px-2 font-bold rounded-md text-white bg-neutral-800 hover:bg-neutral-700">
              Add Question
            </button>
            <div className="hidden group-hover:block absolute p-2 right-0 bg-white border border-solid border-neutral-200 z-10 rounded-md">
              <div
                className="py-1 px-2 mb-1 hover:bg-neutral-200 cursor-pointer rounded-md font-medium"
                onClick={() => addQuestion("categorize")}
              >
                Categorize
              </div>
              <div
                className="py-1 px-2 mb-1 hover:bg-neutral-200 cursor-pointer rounded-md font-medium"
                onClick={() => addQuestion("cloze")}
              >
                Cloze
              </div>
              <div
                className="py-1 px-2 hover:bg-neutral-200 cursor-pointer rounded-md font-medium"
                onClick={() => addQuestion("comprehension")}
              >
                Comprehension
              </div>
            </div>
          </div>
        </div>

        <div>
          {questions.map((que, i) => (
            <div className="flex mt-6" key={i}>
              <div className="flex-grow">
                {que.type === "categorize" ? (
                  <Categorize
                    questionInfo={que}
                    setQuestions={setQuestions}
                    errors={error?.questions && error?.questions[i]}
                    idx={i}
                  />
                ) : que.type === "cloze" ? (
                  <Cloze
                    questionInfo={que}
                    setQuestions={setQuestions}
                    errors={error?.questions && error?.questions[i]}
                    idx={i}
                  />
                ) : que.type === "comprehension" ? (
                  <Comprehension
                    questionInfo={que}
                    setQuestions={setQuestions}
                    errors={error?.questions && error?.questions[i]}
                    idx={i}
                  />
                ) : null}
              </div>
              <div className="m-1 w-20 flex flex-col justify-center">
                <div className="w-5 cursor-pointer relative group">
                  <AddSvg />
                  <div className="hidden group-hover:block absolute p-2 right-0 bg-white border border-solid border-neutral-200 z-10 rounded-md">
                    <div
                      className="py-1 px-2 mb-1 hover:bg-neutral-200 cursor-pointer rounded-md font-medium"
                      onClick={() => addQuestion("categorize")}
                    >
                      Categorize
                    </div>
                    <div
                      className="py-1 px-2 mb-1 hover:bg-neutral-200 cursor-pointer rounded-md font-medium"
                      onClick={() => addQuestion("cloze")}
                    >
                      Cloze
                    </div>
                    <div
                      className="py-1 px-2 hover:bg-neutral-200 cursor-pointer rounded-md font-medium"
                      onClick={() => addQuestion("comprehension")}
                    >
                      Comprehension
                    </div>
                  </div>
                </div>
                <div
                  className="w-5 mt-2 cursor-pointer"
                  onClick={() => copyQuestion(i)}
                >
                  <CopySvg />
                </div>
                <div
                  className="w-5 mt-2 cursor-pointer"
                  onClick={() => removeQuestion(i)}
                >
                  <DeleteSvg />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditForm;
