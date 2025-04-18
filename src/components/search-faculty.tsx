import { AsyncSelect } from '@/components/async-select'
import { useState } from 'react'

interface User {
    id: string;
    name: string;
    role: string;
}

const searchAllUsers = async (query: string = ""): Promise<User[]> => {
    // Mock data for now - replace with actual API call
    return [
        { id: '1', name: 'John Doe', role: 'Professor' },
        { id: '2', name: 'Jane Smith', role: 'Assistant Professor' },
    ].filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
};

export function SearchFaculty() {
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const handleUserChange = (userId: string) => {
        setSelectedUserId(userId);
    };

    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Search Faculty</h2>
                    <p className="mt-4">Please enter the name of the faculty member you are looking for.</p>

                    <form action="" className="mx-auto mt-10 max-w-sm lg:mt-12">
                        <AsyncSelect<User>
                            fetcher={searchAllUsers}
                            preload
                            filterFn={(user, query) => user.name.toLowerCase().includes(query.toLowerCase())}
                            renderOption={(user) => (
                                <div className="flex items-center gap-2">
                                 
                                    <div className="flex flex-col">
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">{user.role}</div>
                                    </div>
                                </div>
                            )}
                            getOptionValue={(user) => user.id}
                            getDisplayValue={(user) => (
                                <div className="flex items-center gap-2 text-left">
                                    <div className="flex flex-col leading-tight">
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                </div>
                            )}
                            notFound={<div className="py-6 text-center text-sm">No users found</div>}
                            label="User"
                            placeholder="Search users..."
                            value={selectedUserId}
                            onChange={handleUserChange}
                            width="375px"
                        />
                    </form>
                </div>
            </div>
        </section>
    );
}
