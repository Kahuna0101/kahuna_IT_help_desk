const CurrentTime = () => {
  const now = new Date();

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    now
  );

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-extrabold lg:text-6xl">{time}</h1>
      <p className="text-lg text-sky-1 lg:text-2xl">{date}</p>
    </div>
  );
};

export default CurrentTime;
