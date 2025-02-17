import styles from "./styles/page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.selectModel}>
        <h2>Chat with ChatGPT</h2>
        <p>ChatGPT API</p>
        <Link href="/pages/chatgpt">
          <button className={`${styles.selectBtn} ${styles.gpt}`}>Go to /chatgpt page</button>
        </Link>
      </div>

      <div className={styles.vl}></div>

      <div className={styles.selectModel}>
        <h2>Chat with Gimini</h2>
        <p>Gemini API</p>
        <Link href="/pages/gemini">
          <button className={`${styles.selectBtn} ${styles.gimini}`}>Go to /gemini page</button>
        </Link>
      </div>

      <div className={styles.vl}></div>

      <div className={styles.selectModel}>
        <h2>Chat with Perplexity</h2>
        <p>Perplexity API</p>
        <Link href="/pages/perplexity">
          <button className={`${styles.selectBtn} ${styles.perplexity}`}>
            Go to /perplexity page
          </button>
        </Link>
      </div>
    </div>
  );
}
