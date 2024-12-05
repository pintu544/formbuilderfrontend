/* eslint-disable react/prop-types */
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Cloze = ({ index, data, answer, setAnswers }) => {
  const sentenceArray = data?.sentenceWithBlanks
    ?.replace(/<u>.*?<\/u>/g, "___________________")
    ?.split("___________________");

  const [options, setOptions] = useState([...(data?.options || [])]);

  function setOption(result) {
    if (!result.destination) return;
    if (!/answer/.test(result.destination.droppableId)) return;
    const answerId = Number(
      result.destination.droppableId.replace("answer", "")
    );
    const item = options?.find((_, i) => i === result?.source?.index);

    setAnswers((prev) => {
      let clone = [...prev];
      let oldAnswer = clone[index].answer;
      oldAnswer[answerId] = item;
      clone[index].answer = oldAnswer;
      return clone;
    });

    setOptions((prev) => [...prev.filter((opt) => opt !== item)]);
  }

  return (
    <div>
      <div className="flex justify-between">
        <div className="font-semibold">Question {index + 1}</div>
        <div className="font-medium">Cloze</div>
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

      <DragDropContext onDragEnd={setOption}>
        <Droppable droppableId={`cloze${1}`} direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div className="mt-3 font-bold">
                {sentenceArray?.map((sentence, i) => (
                  <span key={i}>
                    {sentence}
                    {sentenceArray.length !== i + 1 && (
                      <Droppable droppableId={`answer${i}`}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="inline-block"
                          >
                            {answer?.answer && answer?.answer[i] ? (
                              <span className="bg-neutral-300 px-4 py-2 rounded-md">
                                {answer.answer[i]}
                              </span>
                            ) : (
                              <span className="bg-neutral-300 px-4 py-2 rounded-md">
                                ___________
                              </span>
                            )}
                          </div>
                        )}
                      </Droppable>
                    )}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {options?.map((opt, index) => (
                  <Draggable
                    key={index}
                    index={index}
                    draggableId={`draggable-${index}`}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="bg-neutral-400 text-white px-4 py-2 rounded-md">
                          {opt}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Cloze;
