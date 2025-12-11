/*
 * CUBE
 * Copyright (C) 2025  scidsgn
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use client"

import { useAction } from "@/app/action/use-action"
import { userActionErrorMapper } from "@/app/auth/user-action-errors"
import { Button } from "@/app/components/button/button"
import { Callout } from "@/app/components/callout/callout"
import { Input } from "@/app/components/input/input"
import { createUserAction } from "@/app/settings/admin/accounts/users-actions"
import { SettingsSection } from "@/app/settings/components/settings-section"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

/*
 * CUBE
 * Copyright (C) 2025  scidsgn
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const newUserSchema = z.object({
    userName: z.string().min(1),
})

export const NewUserSection = () => {
    const { control, formState, handleSubmit, reset, setError } = useForm<
        z.infer<typeof newUserSchema>
    >({
        mode: "all",
        defaultValues: {
            userName: "",
        },
        resolver: zodResolver(newUserSchema),
    })

    const createUser = useAction(createUserAction, userActionErrorMapper, {
        onSuccess: () => reset({ userName: "" }),
        onError: () => setError("userName", {}),
    })

    const onSubmit = async (data: z.infer<typeof newUserSchema>) => {
        await createUser.run(data.userName)
    }

    return (
        <SettingsSection name="Create a new user">
            <p className="font-medium">
                Type the username under which you want to create the user. They
                will be able to select their password on first login.
            </p>

            <Callout header="This is janky">
                <p>
                    The user system in CUBE Alpha is half-baked, so this
                    approach to creating users is a stopgap solution before the
                    Good one gets implemented. Enjoy!
                </p>
            </Callout>

            <form
                className="flex min-w-0 items-center gap-1"
                onSubmit={handleSubmit(onSubmit)}
            >
                <span className="-mt-1 font-medium">@</span>

                <Controller
                    render={({ field }) => (
                        <Input
                            className="grow"
                            placeholder="Username"
                            error={!!formState.errors.userName}
                            {...field}
                        />
                    )}
                    name="userName"
                    control={control}
                />

                <Button
                    type="submit"
                    variant="accent"
                    disabled={!formState.isValid}
                    ongoing={createUser.ongoing}
                >
                    Create
                </Button>
            </form>
        </SettingsSection>
    )
}
