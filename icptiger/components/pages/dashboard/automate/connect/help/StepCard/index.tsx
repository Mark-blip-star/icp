import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIcon } from "../StepIcon";

/**
 * A reusable card for each step in the LinkedIn token guide.
 * @param {{
 *  step: number;
 *  title: string;
 *  description: string;
 *  children: React.ReactNode;
 * }} props
 */
export const StepCard = ({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <StepIcon number={step} />
    <Card className="border-2 border-[#0A66C2]/20 bg-white p-2">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-base font-rufina text-center text-[#0A66C2]">
          {title}
        </CardTitle>
        <CardDescription className="text-center text-gray-600 text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className={step === 4 ? "py-2 px-3" : "text-center py-2 px-3"}>{children}</CardContent>
    </Card>
  </div>
);