/* eslint-disable react/prop-types */
import Input from "../custom/Input";
import CloseSvg from "../svgs/CloseSvg";

const MCQcomponent = ({
  data,
  mcqIdx,
  questionIdx,
  handleMCQQuestionChange,
  handleMCQOptionChange,
  handleMCQOptionSelect,
  removeMCQOption,
  errors,
}) => {
  return (
    <div className="py-2 px-4 shadow-md border border-solid border-neutral-200">
      <div className="flex justify-between">
        <div className="text-sm font-medium">
          Question {questionIdx + 1}.{mcqIdx + 1}
        </div>
        <div className="text-sm font-medium">MCQ</div>
      </div>
      <div className="mt-2">
        <Input
          placeholder={`Question ${questionIdx + 1}.${mcqIdx + 1}*`}
          name={`question-${questionIdx}-${mcqIdx}`}
          value={data.question}
          onChange={handleMCQQuestionChange}
          isInvalid={errors?.question}
        />
      </div>
      <div className="mt-2">
        <div className="text-sm font-medium">Options</div>
        {data.options.map((opt, i) => (
          <div key={i} className="mt-2 text-sm w-64 flex items-center">
            <div className="me-2">
              <input
                type="radio"
                name={`option-${questionIdx}-${mcqIdx}-${i}`}
                checked={data.answer === i + 1}
                onClick={handleMCQOptionSelect}
                onChange={() => {}}
              />
            </div>
            <Input
              name={`option-${questionIdx}-${mcqIdx}-${i}`}
              placeholder={`Option ${i + 1} (Optional)`}
              value={opt}
              onChange={handleMCQOptionChange}
              isInvalid={errors?.options && errors?.options[i]}
            />
            <button
              className="w-5 ms-2 cursor-pointer"
              onClick={() => removeMCQOption(mcqIdx, i)}
            >
              <CloseSvg />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MCQcomponent;
