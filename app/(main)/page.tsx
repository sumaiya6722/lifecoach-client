// import Image from "next/image";
import Banner from './homepage/Banner';
import LessonMatter from './homepage/LessonMatter'

export default function Home() {
  return (
    <div>
      <main>
        <Banner></Banner>
        <LessonMatter></LessonMatter>
      </main>
    </div>
  );
}
