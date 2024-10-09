import { getServerSession } from "next-auth";
import ProfileCard from "../components/ProfileCard";
import { authConfig } from "../lib/auth";
import db from "@/app/db";
import { error } from "console";


async function getUserWallet() {
    const session = await getServerSession(authConfig);

    const userWallet = await db.solWallet.findFirst({
        where: {
            userId: session?.user?.uid
        }, 
        select: {
            publicKey: true
        }
    })

    if(!userWallet) {
        return {
            error: "No solana wallet found associated to the user"
        }
    }

    return {error: null, userWallet};
}


const Dashboard = async() => {
    const userWallet = await getUserWallet();

    if(userWallet.error || !userWallet.userWallet?.publicKey) {
        return <>No solana wallet found</>
    }
    return <div>
        <ProfileCard publicKey= {userWallet.userWallet?.publicKey}/>
    </div>
}
export default Dashboard;