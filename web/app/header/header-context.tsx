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

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

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

type HeaderContextValue = {
    node: ReactNode
    setNode: (node: ReactNode) => void
}

const HeaderContext = createContext<HeaderContextValue>({
    node: null,
    setNode: () => {},
})

export const HeaderContextProvider = ({
    children,
}: {
    children?: ReactNode
}) => {
    const [node, setNode] = useState<ReactNode>(null)

    return (
        <HeaderContext.Provider value={{ node, setNode }}>
            {children}
        </HeaderContext.Provider>
    )
}

export const HeaderContent = ({ children }: { children?: ReactNode }) => {
    const { setNode } = useContext(HeaderContext)

    useEffect(() => {
        setNode(children)

        return () => setNode(null)
    }, [setNode, children])

    return null
}

export const HeaderSlot = () => {
    const { node } = useContext(HeaderContext)

    return node
}
