interface IProps {
  revealingWord: string;
}

export default function RevealingWord({ revealingWord }: IProps) {
  return (
    <div
      style={{
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {revealingWord && (
        <div
          style={{
            width: `${revealingWord.length * 25}px`,
            minWidth: "200px",
          }}
          className="revealing-word"
        >
          {revealingWord.split("").map((letter, index) => (
            <h1 key={index}>{letter}</h1>
          ))}
        </div>
      )}
    </div>
  );
}
