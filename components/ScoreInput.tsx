import { asset, Head } from "$fresh/runtime.ts";

type Props = {
  label: string;
  name: string;
  value: number;
  char?: string;
  className?: string;
};

export default function ScoreInput({
  label,
  name,
  value = 3,
  char = "🤘",
  className,
}: Props) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={asset("score-input.css")} />
      </Head>

      <div
        class={[className, "score-input"].filter(Boolean).join(" ")}
      >
        {label}

        <div class="score-input__scores">
          {new Array(5).fill(null).map((_val, index) => (
            <label
              class="form-control"
              data-active={value > index}
              arial-label={index + 1}
            >
              {char}
              <input
                type="radio"
                name={name}
                checked={value === index + 1}
                value={index + 1}
              />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
