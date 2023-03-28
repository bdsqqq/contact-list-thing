import { type NextPage } from "next";
import Head from "next/head";

import { Subscribers } from "~/components/Subscribers";
import { ContactLists } from "~/components/ContactLists";
import { Upload } from "~/components/Upload";
import { Shell } from "~/components/Shell";

const ContactListsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell actions={<button>New</button>}>
        <main className="flex flex-col gap-8 p-8">
          <section>
            <h2>LISTS</h2>
            <ContactLists />
          </section>

          <section>
            <h2>SUBSCRIBERS</h2>
            <Subscribers />
          </section>

          <section>
            <h2>UPLOAD</h2>
            <Upload />
          </section>
        </main>
      </Shell>
    </>
  );
};

export default ContactListsPage;