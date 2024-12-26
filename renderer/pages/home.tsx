import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  //

  //

  return (
    <React.Fragment>
      <Head>
        <title>Jesus loves me this i know!</title>
      </Head>

      <div>
        <button
          onClick={() => {
            //
            window.ipc.run("loadFolder", "Hello", (data) => {
              console.log(data);
            });
          }}
        >
          Test Generate Array
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            //
            window.ipc.run(
              "getEmbeddingsByList",
              ["I am a software developer", "i love to code"],
              (data) => {
                console.log(data);
              }
            );
          }}
        >
          Test add doc
        </button>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/next">Go to next page</Link>
      </div>
    </React.Fragment>
  );
}

//
