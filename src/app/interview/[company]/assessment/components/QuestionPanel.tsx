"use client";

import { Copy, Lightbulb } from "lucide-react";

const question = {
  title: "Maximum Sum of Distinct Subarray",
  difficulty: "Medium",
  type: "Coding",

  description: `
Given an integer array nums and an integer k, find the maximum sum of any subarray of size k containing only distinct elements.

Return the maximum possible sum.
`,

  examples: [
    {
      input: "nums = [1,5,4,2,9,9,9], k = 3",
      output: "15",
      explanation: "Subarray [4,2,9] has all distinct elements and maximum sum.",
    },
    {
      input: "nums = [4,4,4], k = 3",
      output: "0",
      explanation: "No valid subarray exists.",
    },
  ],

  constraints: [
    "1 ≤ nums.length ≤ 100000",
    "1 ≤ nums[i] ≤ 100000",
    "1 ≤ k ≤ nums.length",
  ],
};

export default function QuestionPanel() {
  return (
    <section className="flex-1 overflow-y-auto bg-background">
      <div className="mx-auto max-w-5xl p-8">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <div className="flex items-center gap-3">

              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500">
                {question.type}
              </span>

              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-500">
                {question.difficulty}
              </span>

            </div>

            <h1 className="mt-4 text-3xl font-bold">
              {question.title}
            </h1>

          </div>

          <button
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-zinc-200
              px-4
              py-2
              text-sm
              transition
              hover:border-orange-500
              dark:border-zinc-700
            "
          >
            <Copy size={16} />
            Copy
          </button>

        </div>

        {/* Description */}

        <section className="mb-10">

          <h2 className="mb-4 text-xl font-semibold">
            Description
          </h2>

          <p className="leading-8 text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
            {question.description}
          </p>

        </section>

        {/* Examples */}

        <section className="mb-10">

          <h2 className="mb-5 text-xl font-semibold">
            Examples
          </h2>

          <div className="space-y-6">

            {question.examples.map((example, index) => (

              <div
                key={index}
                className="
                  rounded-2xl
                  border
                  border-zinc-200
                  bg-zinc-50
                  p-6
                  dark:border-zinc-800
                  dark:bg-zinc-900
                "
              >
                <p className="font-semibold">
                  Example {index + 1}
                </p>

                <div className="mt-5 space-y-4 font-mono text-sm">

                  <div>
                    <span className="font-semibold">
                      Input:
                    </span>

                    <div className="mt-2 rounded-lg bg-background p-3">
                      {example.input}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold">
                      Output:
                    </span>

                    <div className="mt-2 rounded-lg bg-background p-3">
                      {example.output}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold">
                      Explanation:
                    </span>

                    <div className="mt-2 rounded-lg bg-background p-3">
                      {example.explanation}
                    </div>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* Constraints */}

        <section className="mb-10">

          <h2 className="mb-5 text-xl font-semibold">
            Constraints
          </h2>

          <ul className="space-y-3">

            {question.constraints.map((constraint) => (

              <li
                key={constraint}
                className="rounded-xl bg-zinc-100 px-4 py-3 font-mono text-sm dark:bg-zinc-900"
              >
                {constraint}
              </li>

            ))}

          </ul>

        </section>

        {/* Tip */}

        <section
          className="
            rounded-2xl
            border
            border-orange-500/20
            bg-orange-500/5
            p-6
          "
        >
          <div className="flex gap-4">

            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
              <Lightbulb size={20} />
            </div>

            <div>

              <h3 className="font-semibold">
                Hint
              </h3>

              <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
                Think about using a sliding window combined with a
                HashMap to efficiently maintain distinct elements.
              </p>

            </div>

          </div>

        </section>

      </div>
    </section>
  );
}