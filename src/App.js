//a componment is a function in react
import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase";
import { RealtimePresence } from "@supabase/supabase-js";
const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App() {
  //whatever we retrun will be visible in thee interface*
  // to load something image or whatever react looks to the public folder
  //we can use the fragment <></> to avoid parent problems in jsx
  // 1 . state variable
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]); // whatever we pass in setFacts will be the new state
  const [isLoading, setIsLoading] = useState(false); // to show the loader
  const [currentCategory, setCurrentCategory] = useState("All");

  {
    /*showForm is the state variable and setShowForm is the function to update it true or false state
    we need to use state setter function to call back in the onclick to change the state and run entiere componment
    again AND RENDER IT 
    WHENEVER WE NEED TO CHANGE SOMETHING IN THE SCREEN WE USE THE STATE VARIABLE 
    */
  }
  // 1. useEffect to fetch data from supabase and run each time we load the app
  // and the [] means that we want to run it only once when the app loads
  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true); // to show the loader

        let query = supabase.from("facts").select("*");
        if (currentCategory !== "All")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("id", { ascending: false })
          .limit(100);
        if (!error) setFacts(facts);
        else alert("there was an error in loading data ");
        setIsLoading(false); // to hide the loader
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      {/* HEADER */}
      <Header showForm={showForm} setShowForm={setShowForm} />
      {/* 2. USE STATE VARIABLE */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I Learned" width="64px" height="64px" />
        <h1>Today's Fact</h1>
      </div>

      <button
        className="btn btn-large btn-open"
        // 3. UPDATE STATE VARIABLE
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}
const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];
function isValidUrl(string) {
  try {
    new URL(string);
  } catch (_) {
    return false; // Invalid URL
  }
  return true; // Valid URL
}
function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textlength = text.length;

  async function handleSubmit(e) {
    e.preventDefault(); // to prevent the page from reloading and now we can get entered data from
    //  ( text, source, category of the state variables  )
    // 2. check if data is valid
    if (text && isValidUrl(source) && category && textlength <= 200) {
      //3. create a new fact object
      // const newFact = {
      //   id: Math.round(Math.random() * 1000),
      //   text: text,
      //   source: source,
      //   category: category,
      //   votesInteresting: 24,
      //   votesMindblowing: 9,
      //   votesFalse: 4,
      //   createdIn: new Date().getFullYear(),
      // };

      // upload fact to the supabase
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);
      //4. add the new fact to UI

      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      //5. RESET THE INPUT FIELDS
      setText("");
      setSource("");
      setCategory("");
      //6. CLOSE THE ENTIERE FORM
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form " onSubmit={handleSubmit}>
      {/* we need to put a function in the {} not to call function not (function()) like the handlesubmit without () */}
      <input
        type="text "
        placeholder="Share a fact with the world !"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textlength}</span>
      <input
        type="text"
        placeholder="Trust worthy source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category :</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Share
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li>
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("All")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li>
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
//fact list component
function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return <p className="message">No Facts for this one ! </p>;
  }

  return (
    <section>
      {" "}
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>{" "}
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  async function handleVote(colomnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [colomnName]: fact[colomnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li class="facts">
      <p>
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => fact.category == cat.name)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍<strong>{fact.votesInteresting}</strong>
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 <strong> {fact.votesMindblowing} </strong>
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ <strong>{fact.votesFalse}</strong>
        </button>
      </div>
    </li>
  );
}

export default App;
