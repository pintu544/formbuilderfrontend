/* eslint-disable react/prop-types */

const Comprehension = ({ index, data, answer, setAnswers }) => {
  const setMCQAnswer = (mcqindex, optIndex) => {
    setAnswers((prev) => {
      let clone = [...prev];
      let mcqAnswers = clone[index].answer;
      mcqAnswers[mcqindex] = optIndex + 1;
      clone[index].answer = mcqAnswers;
      return clone;
    });
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="font-semibold">Question {index + 1}</div>
        <div className="font-medium">Comprehension</div>
        <div className="font-medium">Points: {data?.points}</div>
      </div>

      {data?.imageUrl && (
        <div className="flex justify-center mt-3">
          <div className="w-[min(500px,100%)]">
            <img
              src={data?.imageUrl}
              className="w-full max-h-52 object-contain"
            />
          </div>
        </div>
      )}

      <div className="mt-3">{data?.passage}</div>

      <div className="mt-3">
        {data?.mcqs?.map((mcq, mcqIndex) => (
          <div
            key={mcq?._id}
            className="text-sm border border-solid border-neutral-200 bg-neutral-50 p-3 rounded mt-2"
          >
            <div className="font-bold">
              Question {`${index + 1}.${mcqIndex + 1}`}
            </div>

            <p>Que: {mcq?.question}</p>

            <div className="mt-2">
              {mcq?.options?.map((opt, optIndex) => (
                <div key={opt}>
                  <input
                    type="radio"
                    id={`option${index}-${mcqIndex}-${optIndex}`}
                    name={`options${index}-${mcqIndex}`}
                    className="me-1"
                    checked={answer?.answer[mcqIndex] === optIndex + 1}
                    onChange={() => setMCQAnswer(mcqIndex, optIndex)}
                  />
                  <label htmlFor={`option${index}-${mcqIndex}-${optIndex}`}>
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comprehension;
