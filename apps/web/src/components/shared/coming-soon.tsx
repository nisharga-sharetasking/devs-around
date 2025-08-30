import { CalendarClock, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Container from "./container"

interface ComingSoonProps {
    title?: string
    description?: string
    estimatedDate?: string
}

export function ComingSoon({
    title = "Feature Coming Soon",
    description = "We'll inform you when this feature becomes available to use.",
    estimatedDate,
}: ComingSoonProps) {
    return (
        <Container className="min-h-[70vh] flex items-center justify-center">
            <div className="flex h-full w-full items-center justify-center p-4 md:p-6 ">
                <Card className="w-full overflow-hidden p-0 text-center transition-all duration-300 animate-fadeIn border-none shadow-none">
                    <div className="relative">
                        <CardHeader className="pb-2 p-0">
                            <div className="mx-auto mb-2 sm:mb-4 flex size-10 md:size-16 items-center justify-center rounded-full bg-[#6D70FC] shadow-md animate-pulse">
                                <Clock className="size-5 md:size-8 text-white" />
                            </div>
                            <CardTitle className="text-lg md:text-2xl font-bold text-[#6D70FC]">{title}</CardTitle>
                            {description && <CardDescription className="mt-2 sm:mt-3 text-sm md:text-base">{description}</CardDescription>}
                        </CardHeader>
                        <CardContent className="pb-6 p-0">
                            {estimatedDate && (
                                <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#6D70FC]/15 px-4 py-2 text-sm font-medium text-[#6D70FC]">
                                    <CalendarClock className="h-4 w-4 animate-bounce" />
                                    <span>Estimated availability: {estimatedDate}</span>
                                </div>
                            )}
                        </CardContent>
                    </div>
                </Card>
            </div>
            <div className=""></div>
        </Container>
    )
}
