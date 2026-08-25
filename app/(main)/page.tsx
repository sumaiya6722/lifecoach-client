// import Image from "next/image";
import Banner from './homepage/Banner';
import LessonMatter from './homepage/LessonMatter';
import MostSavedLesson from './homepage/MostSavedLesson';
import TopContributor from './homepage/TopContributor';

export default function Home() {
  return (
    <div>
      <main>
        <Banner></Banner>
        <MostSavedLesson></MostSavedLesson>
        <TopContributor></TopContributor>
        <LessonMatter></LessonMatter>
      </main>
    </div>
  );
}
