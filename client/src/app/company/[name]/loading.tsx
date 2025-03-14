import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (


        <div className="container mx-auto py-10 px-4 space-y-8 " >

            <div className="mb-8">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Companies
                    </Button>
                </Link>
                <Skeleton className="w-80 h-20"></Skeleton>
            </div>

            <div className="mb-6 space-y-2">
                <Skeleton className="w-96 h-10"></Skeleton>
                <Skeleton className="w-96 h-4">
                </Skeleton>
            </div>

            <Skeleton className="w-full h-10" />
            
            <Skeleton className="w-full h-80" />


        </div>


    )
}