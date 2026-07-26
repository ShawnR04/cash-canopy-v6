import { X } from "lucide-react";

interface OpenModalProps{
  isOpen:boolean
  setIsOpen: (val: boolean) => void
  goal: Goal;
}

export interface Goal {
    id: number;
    name: string;
    targetAmount: string;
    currentAmount: string;
    currency: string;
    targetDate: Date;
}

export default function UpdateGoalsModal({ isOpen, setIsOpen, goal }: OpenModalProps){
    return(
        <>
            <div className="modal-background z-2">
                <div className="background-glow"/>
                <form className="modal-form">
                    <div className="flex items-center justify-between relative">
                        <div className="">
                            <h1 className="form-heading">
                              Update Goal: <span className="capitalize">{goal.name}</span>
                            </h1>
                        </div>
                        <button
                          onClick={() => setIsOpen(!isOpen)}
                          className="close-modal"
                          aria-label="Close Modal"
                          type="button"
                        >
                          <X/>
                        </button>
                    </div>

                    {/* TODO: Continue witht the update logic */}
                </form>
            </div>
        </>
    );
}