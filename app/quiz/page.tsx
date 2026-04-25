import type { Metadata } from 'next';
import { DadQuiz } from './DadQuiz';

export const metadata: Metadata = {
  title: "How Many Did Your Dad Tell You? | Dad Humor",
  description:
    "10 classic dad jokes. How many has your dad already inflicted on you? Take the test and find out your Dad Joke Damage Score.",
  openGraph: {
    title: "How Many Did Your Dad Tell You? | Dad Humor",
    description:
      "10 classic dad jokes. Tap Yes or No. Find out your damage. dadhumor.app/quiz",
    url: 'https://dadhumor.app/quiz',
  },
};

export default function QuizPage() {
  return <DadQuiz />;
}
