
import LessonCard from "../../cards/LessonCard";


const MyLessons = async () => {

  const lessons = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/lessons`).then(res => res.json());

  return (
    <div className="flex flex-col items-center container mx-auto">
      <h2 className="text-3xl my-5">All Lessons Page</h2>
      <div className="flex flex-wrap gap-3">

        {lessons.map((lesson) => <LessonCard lesson={lesson} key={lesson._id}></LessonCard>)}
      </div>
    </div>
  );
};

export default MyLessons;