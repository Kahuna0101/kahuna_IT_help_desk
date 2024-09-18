const CurrentDate = () => {
  const now = new Date();

  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
    now
  );

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-4xl font-extrabold lg:text-4xl">Today's Date:</h1>
      <p className="text-lg text-dark-700 lg:text-2xl">{date}</p>
    </div>
  );
};

export default CurrentDate;
