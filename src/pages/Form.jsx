import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Categorize from "../components/client-questions/Categorize.jsx";
import Cloze from "../components/client-questions/Cloze.jsx";
import Comprehension from "../components/client-questions/Comprehension.jsx";

import Input from "../components/custom/Input.jsx";
import LoadingSvg from "../components/svgs/LoadingSvg.jsx";

import { axiosOpen } from "../utils/axios.js";
import { isValidBool, isValid } from "../utils/support.js";

const Form = () => {
  const { formId } = useParams();

  const [detailsForm, setDetailsForm] = useState(true);
  const [details, setDetails] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState({ name: false, email: false });

  const [answers, setAnswers] = useState([]);

  const [query, setQuery] = useState(true);
  const { data, refetch } = useQuery({
    queryKey: ["form", formId],
    queryFn: async () => {
      const { data } = await axiosOpen.get(`/forms/client/${formId}`);
      setQuery(false);

      setAnswers([
        ...(data?.data?.questions?.map((que) => {
          let queObj = { _id: que._id, type: que.type };

          if (que.type === "categorize") {
            let answer = {};
            que.categories.forEach((category) => {
              answer[category] = [];
            });
            queObj.answer = answer;
          } else if (que.type === "cloze") {
            queObj.answer = [];
          } else if (que.type === "comprehension") {
            queObj.answer = que?.mcqs?.map(() => 1);
          }

          return queObj;
        }) || []),
      ]);

      return data?.data;
    },
    enabled: query,
  });

  const { mutate: checkValidResponse, isPending: checkingValidResponse } =
    useMutation({
      mutationFn: () => {
        return axiosOpen.post(`/respondents/${formId}/check-valid-response`, {
          email: details.email,
        });
      },
      onSuccess: () => {
        setDetailsForm(false);
      },
      onError: (err) => {
        console.log(err);
        const message = err?.response?.data?.message;
        toast.error(message || "Something went wrong, Retry!");
      },
    });

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return axiosOpen.post(`/respondents/${formId}`, {
        ...details,
        answers,
      });
    },
    onSuccess: () => {
      toast.success("Form submitted successfull!");
      setDetailsForm(true);
      refetch();
    },
    onError: (err) => {
      console.log(err);
      toast.error(
        err?.response?.data?.message || "Something went wrong, Retry!"
      );
    },
  });

  const onDetailFormChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleDetailFormSubmit = () => {
    let errObj = {
      email: !isValidBool(details.email),
      name: !isValidBool(details.name),
    };

    if (Object.values(errObj).reduce((prev, curr) => prev || curr, false)) {
      toast.error("Both fields are required!");
    }

    if (isValid("Email", details.email, "email") !== "") {
      toast.error("Email is invalid!");
      errObj.email = true;
    }

    setErrors((prev) => ({ ...prev, ...errObj }));

    if (Object.values(errObj).reduce((prev, curr) => prev || curr, false))
      return;

    checkValidResponse();
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="pt-10 pb-20 px-3">
          <div className="max-w-4xl mx-auto bg-white rounded-xl mt-2 p-3 shadow-md">
            <div className="font-bold text-3xl text-center underline">
              {data?.formName}
            </div>

            {data?.headerImage && (
              <div className="h-56 mt-2">
                <img
                  src={data?.headerImage}
                  alt="headerImage"
                  className="w-full h-full rounded-md object-contain"
                />
              </div>
            )}
          </div>

          <div className="mt-2">
            {data?.questions?.map((question, index) => (
              <div
                key={question._id}
                className="max-w-4xl mx-auto bg-white rounded-xl mt-2 p-3 shadow-md"
              >
                {question?.type === "categorize" ? (
                  <Categorize
                    index={index}
                    data={question}
                    answer={answers[index]}
                    setAnswers={setAnswers}
                  />
                ) : question?.type === "cloze" ? (
                  <Cloze
                    index={index}
                    data={question}
                    answer={answers[index]}
                    setAnswers={setAnswers}
                  />
                ) : question?.type === "comprehension" ? (
                  <Comprehension
                    index={index}
                    data={question}
                    answer={answers[index]}
                    setAnswers={setAnswers}
                  />
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 max-w-4xl mx-auto">
            <button
              onClick={mutate}
              disabled={isPending}
              className="bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-800 text-white w-full px-2 py-2 font-extrabold rounded-xl shadow-md"
            >
              {isPending ? (
                <>
                  <LoadingSvg className="animate-spin invert w-5 inline-block me-2 mb-[2px]" />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>

      {/*User Details Form*/}
      <div
        className={`w-screen min-h-screen bg-white bg-opacity-50 backdrop-blur-sm ${
          detailsForm ? "fixed" : "hidden"
        } top-0 grid place-content-center`}
      >
        <div className="bg-neutral-200 m-2 p-4 rounded-lg w-[min(90vw,400px)]">
          <div className="text-center font-bold text-2xl">
            Fill To Continue...
          </div>

          <div className="mt-3">
            <Input
              id="name"
              placeholder="Name"
              size="lg"
              value={details?.name}
              onChange={onDetailFormChange}
              isInvalid={errors?.name}
            />
          </div>
          <div className="mt-3">
            <Input
              id="email"
              placeholder="Email"
              size="lg"
              value={details?.email}
              onChange={onDetailFormChange}
              isInvalid={errors?.email}
            />
          </div>

          <div className="text-center mt-3">
            <button
              className="bg-neutral-900 hover:bg-neutral-700 px-4 py-2 text-white font-bold rounded-lg"
              onClick={handleDetailFormSubmit}
              disabled={checkingValidResponse}
            >
              {checkingValidResponse ? "Loading..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
