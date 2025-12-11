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
import { useAction } from "@/app/action/use-action"
import { Button } from "@/app/components/button/button"
import { DestructiveButton } from "@/app/components/button/destructive-button"
import { interruptAction } from "@/app/settings/venus/library/scan/interrupt-action"
import { rescanAction } from "@/app/settings/venus/library/scan/rescan-action"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"

export const ScanButton = ({ mutate }: { mutate: () => unknown }) => {
    const scan = useAction(rescanAction, venusErrorMapper, {
        onSuccess: mutate,
        onError: mutate,
    })

    return (
        <Button
            icon="refresh"
            variant="accent"
            ongoing={scan.ongoing}
            onClick={scan.run}
        >
            Scan
        </Button>
    )
}

export const InterruptScanButton = ({ mutate }: { mutate: () => unknown }) => {
    const interrupt = useAction(interruptAction, venusErrorMapper, {
        onSuccess: mutate,
        onError: mutate,
    })

    return (
        <DestructiveButton
            confirmation={{
                header: "Interrupt scan?",
                content: (
                    <p>
                        Tracks already imported will not be removed from the
                        library, but additional data may be missing.
                    </p>
                ),
                icon: "close",
                button: "Interrupt",
            }}
            icon="close"
            variant="red"
            ongoing={interrupt.ongoing}
            onClick={interrupt.run}
        >
            Interrupt
        </DestructiveButton>
    )
}
