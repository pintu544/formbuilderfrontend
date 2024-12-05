/* eslint-disable react/prop-types */
import Input from "../custom/Input";
import AddSvg from "../svgs/AddSvg";
import CloseSvg from "../svgs/CloseSvg";
import CopySvg from "../svgs/CopySvg";
import DeleteSvg from "../svgs/DeleteSvg";
import ImageSvg from "../svgs/ImageSvg";
import MCQ from "./MCQ";

const Comprehension = ({ idx, questionInfo, setQuestions, errors }) => {
  const handleChange = (event) => {
    if (event.target.name !== "image") {
      return setQuestions((prev) => {
        let clone = prev;
        clone[idx] = {
          ...clone[idx],
          [event.target.name]: event.target.value,
        };
        return [...clone];
      });
    }
    if (
      event.target.files[0]?.type === "image/jpeg" ||
      event.target.files[0]?.type === "image/png" ||
      event.target.files[0]?.type === "image/jpg"
    ) {
      setQuestions((prev) => {
        let clone = prev;
        clone[idx] = {
          ...clone[idx],
          imageUrl: URL.createObjectURL(event.target.files[0]),
          imageFile: event.target.files[0],
        };
        return [...clone];
      });
    } else {
      setQuestions((prev) => {
        let clone = prev;
        clone[idx] = {
          ...clone[idx],
          imageUrl: "",
          imageFile: "",
        };
        return [...clone];
      });
      event.target.value = null;
    }
  };

  const removeImage = () => {
    setQuestions((prev) => {
      const clone = [...prev];
      clone[idx].imageFile = "";
      clone[idx].imageUrl = "";
      return clone;
    });
  };

  const addMCQ = () => {
    setQuestions((prev) => {
      let clone = [...prev];
      clone[idx] = {
        ...clone[idx],
        mcqs: [
          ...clone[idx].mcqs,
          {
            question: "",
            options: [""],
            answer: "",
          },
        ],
      };
      return [...clone];
    });
  };

  const copyMCQ = (mcqIdx) => {
    setQuestions((prev) => {
      let clone = [...prev];
      const previousMCQs = clone[idx].mcqs;
      clone[idx].mcqs = [
        ...previousMCQs.slice(0, idx + 1),
        { ...previousMCQs[mcqIdx] },
        ...previousMCQs.slice(idx + 1),
      ];
      return [...clone];
    });
  };

  const deleteMCQ = (mcqIdx) => {
    setQuestions((prev) => {
      let clone = [...prev];
      const previousMCQs = clone[idx].mcqs;
      if (previousMCQs.length === 1) return prev;
      clone[idx].mcqs = [...previousMCQs.filter((_, i) => i !== mcqIdx)];
      return [...clone];
    });
  };

  const handleMCQQuestionChange = (event) => {
    const questionNo = Number(
      event.target.name.replace(`question-${idx}-`, "")
    );
    setQuestions((prev) => {
      let clone = prev;
      let mcqsArr = clone[idx].mcqs;
      mcqsArr[questionNo] = {
        ...mcqsArr[questionNo],
        question: event.target.value,
      };
      clone[idx].mcqs = mcqsArr;
      return [...clone];
    });
  };

  const handleMCQOptionChange = (event) => {
    let [, , mcqIdx, optIdx] = event.target.name.split("-");
    optIdx = Number(optIdx);
    const questionIdx = Number(mcqIdx.replace("-", ""));
    setQuestions((prev) => {
      let clone = prev;
      let mcqsArr = clone[idx].mcqs;
      let optsArr = mcqsArr[questionIdx].options;
      optsArr[optIdx] = event.target.value;
      if (optsArr.length === optIdx + 1 && event.target.value.trim()) {
        optsArr.push("");
      }
      mcqsArr[questionIdx].options = optsArr;
      clone[idx].mcqs = mcqsArr;
      return [...clone];
    });
  };

  const handleMCQOptionSelect = (event) => {
    let [, , mcqIdx, optIdx] = event.target.name.split("-");
    optIdx = Number(optIdx);
    const questionIdx = Number(mcqIdx.replace("-", ""));
    setQuestions((prev) => {
      let clone = prev;
      let mcqsArr = clone[idx].mcqs;
      mcqsArr[questionIdx].answer = optIdx + 1;
      clone[idx].mcqs = mcqsArr;
      return [...clone];
    });
  };

  const removeMCQOption = (mcqIdx, optionIdx) => {
    setQuestions((prev) => {
      let clone = prev;
      let mcqsArr = clone[idx].mcqs;
      let optsArr = mcqsArr[mcqIdx].options;
      if (optsArr.length === 1) return prev;
      mcqsArr[mcqIdx].options = optsArr.filter((_, i) => i !== optionIdx);
      if (mcqsArr[mcqIdx].answer === optionIdx + 1) mcqsArr[mcqIdx].answer = 1;
      clone[idx].mcqs = mcqsArr;
      return [...clone];
    });
  };

  return (
    <div className="flex-grow p-4 bg-white border-l-8 border-solid border-l-neutral-800 border-t border-t-neutral-100 rounded-md shadow-md">
      <div className="flex justify-between">
        <div className="font-semibold">Question {idx + 1}</div>
        <div className="font-medium">Comprehension</div>
        <div className="w-20">
          <Input
            type="number"
            placeholder="Points"
            name="points"
            value={questionInfo.points}
            onChange={handleChange}
            isInvalid={errors?.points}
          />
        </div>
      </div>
      <div className="mt-4 flex">
        <div className="flex-grow w-[min(100%,500px)]">
          <label className="font-medium"></label>
          <textarea
            name="passage"
            className={`w-full px-2 py-1 outline-none border-2 border-solid ${
              errors?.passage ? "border-red-400" : "border-neutral-300"
            } rounded-md`}
            value={questionInfo.passage}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="inline-block relative ms-1">
          <input
            type="file"
            className="absolute top-0 left-0 opacity-0 w-full h-full"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <div className="w-8">
            <ImageSvg />
          </div>
        </div>
      </div>
      {questionInfo.imageUrl && (
        <div className="mt-2 h-28 relative max-w-max">
          <img
            src={questionInfo.imageUrl}
            alt="categoryImage"
            className="h-full max-w-full object-contain"
          />
          <div
            className="w-5 absolute top-1 right-1 z-10 cursor-pointer invert"
            onClick={removeImage}
          >
            <CloseSvg />
          </div>
        </div>
      )}
      <div className="mt-6">
        {questionInfo.mcqs.map((mcq, i) => (
          <div key={i} className="flex mt-2">
            <div className="flex-grow">
              <MCQ
                data={mcq}
                mcqIdx={i}
                questionIdx={idx}
                {...{
                  handleMCQQuestionChange,
                  handleMCQOptionChange,
                  handleMCQOptionSelect,
                  removeMCQOption,
                }}
                errors={errors?.mcqs && errors?.mcqs[i]}
              />
            </div>
            <div className="m-1 w-10 flex flex-col justify-center">
              <div className="w-5 cursor-pointer" onClick={addMCQ}>
                <AddSvg />
              </div>
              <div
                className="w-5 mt-2 cursor-pointer"
                onClick={() => copyMCQ(i)}
              >
                <CopySvg />
              </div>
              <div
                className="w-5 mt-2 cursor-pointer"
                onClick={() => deleteMCQ(i)}
              >
                <DeleteSvg />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comprehension;
