/**
 * A reusable circular icon to show the step number.
 * @param {{ number: number }} props
 */
export const StepIcon = ({ number }: { number: number }) => (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-[#0A66C2] w-10 h-10 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-lg">{number}</span>
      </div>
    </div>
);