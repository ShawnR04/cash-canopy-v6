
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LogOutIcon } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions:{
                onSuccess: () => {
                    router.push("/auth/login")
                }
            }
        })
    }

    return (
      <>
          <button 
              onClick={() => setIsOpen(true)}
              type="button"
              aria-label="Logout"
              className={cn("text-destructive bg-destructive/15 cursor pointer p-1 rounded-md cursor-pointer",
                  isOpen ? "bg-destructive text-foreground" : "",
              )}
          >
              <LogOutIcon className="w-8 h-8"/>
          </button>

          {isOpen && (
              <div 
                  onClick={() => setIsOpen(false)}
                  className="bg-card/50 fixed inset-0 top-0 left-0 w-screen h-full backdrop-blur-xs flex items-center justify-center z-50"
              >
                  <div className="w-80 p-3 bg-secondary/40 rounded-md space-y-1">
                    <h1 className="h-10 text-xl flex items-center justify-center">
                        Are you absolutely sure?
                    </h1>
                    <p className="text-sm text-center">
                        This will end your current active session and you will need to sign back in to access the hero section.
                    </p>
                    <div className="h-15 flex items-center justify-end gap-3">
                        <Button
                            onClick={() => setIsOpen(false)}
                            variant="outline"
                            className="p-4 text-[14px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSignOut}
                            variant="destructive"
                            className="p-4 text-[14px]"
                        >
                            Yes, Logout
                        </Button>
                    </div>
                  </div>
              </div>
          )}
      </>
    )
}
