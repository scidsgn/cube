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
import { setupAdminAccountAction } from "@/app/auth/login/admin-setup-action"
import { userActionErrorMapper } from "@/app/auth/user-action-errors"
import { Button } from "@/app/components/button/button"
import { Callout } from "@/app/components/callout/callout"
import { cx } from "@/app/cva.config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryState } from "nuqs"
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

const adminSchema = z.object({
    userName: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
})

export const AdminForm = () => {
    const { control, formState, handleSubmit } = useForm<
        z.infer<typeof adminSchema>
    >({
        defaultValues: {
            userName: "",
            password: "",
        },
        resolver: zodResolver(adminSchema),
    })

    const setupAdminAccount = useAction(
        setupAdminAccountAction,
        userActionErrorMapper,
    )

    const [redirect] = useQueryState("redirect")

    const onSubmit = async (data: z.infer<typeof adminSchema>) => {
        await setupAdminAccount.run(data.userName, data.password, redirect)
    }

    return (
        <form
            className="flex max-w-108 flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Callout header="Admin account needed">
                <p>
                    CUBE needs at least one active admin account to be present
                    for maintenance functionality.
                </p>
            </Callout>

            <label className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2 text-sm font-medium">
                    <span>Username:</span>
                    {formState.errors.userName?.message && (
                        <span className="text-red-400">
                            {formState.errors.userName.message}
                        </span>
                    )}
                </div>
                <Controller
                    control={control}
                    name="userName"
                    render={({ field }) => (
                        <input
                            className={cx(
                                "inset-ring-accent-500 bg-black px-3 py-2 font-medium outline-none focus-visible:inset-ring",
                                formState.errors.userName &&
                                    "inset-ring inset-ring-red-500",
                            )}
                            {...field}
                        />
                    )}
                />
            </label>

            <label className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2 text-sm font-medium">
                    <span>Password:</span>
                    {formState.errors.userName?.message && (
                        <span className="text-red-400">
                            {formState.errors.userName.message}
                        </span>
                    )}
                </div>
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <input
                            type="password"
                            className={cx(
                                "inset-ring-accent-500 bg-black px-3 py-2 font-medium outline-none focus-visible:inset-ring",
                                formState.errors.userName &&
                                    "inset-ring inset-ring-red-500",
                            )}
                            {...field}
                        />
                    )}
                />
            </label>

            <Button
                type="submit"
                className="self-end"
                icon="login"
                variant="accent"
                size="lg"
                ongoing={formState.isSubmitting || setupAdminAccount.ongoing}
            >
                Set up
            </Button>
        </form>
    )
}
