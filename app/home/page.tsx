import { getSession } from "@/lib/session";

export default async function Home(){
    const session = await getSession();
    return(
        <div className="">
            Hello {session?.user.username}

            <br/><a href="pages/goals">goals</a>
        </div>
    );
}