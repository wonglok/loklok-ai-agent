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

      <button
        onClick={() => {
          //
          window.ipc.send("message", "Hello");
          //
        }}
      >
        Trigger
      </button>

      <button
        onClick={() => {
          //
          window.ipc.run("loadFolder", "Hello", (data) => {
            console.log(data);
          });
        }}
      >
        Load Folder
      </button>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/next">Go to next page</Link>
      </div>
    </React.Fragment>
  );
}
