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

import { useAccentStyle } from "@/app/components/accent/accent-provider"
import { Button, LinkButton } from "@/app/components/button/button"
import { Menu } from "@/app/components/menu/menu-types"
import {
    Content,
    Item,
    Portal,
    Root,
    Separator,
    Trigger,
} from "@radix-ui/react-context-menu"
import { HTMLAttributes } from "react"

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

type ContextMenuProps = HTMLAttributes<HTMLDivElement> & {
    menu: Menu
}

export const ContextMenu = ({ menu, ...props }: ContextMenuProps) => {
    const accentStyle = useAccentStyle()

    return (
        <Root>
            <Trigger asChild>
                <div {...props} />
            </Trigger>
            <Portal>
                <Content
                    className="z-100 flex flex-col border-2 border-gray-950 bg-gray-900 p-1 shadow-lg shadow-gray-950"
                    collisionPadding={24}
                    style={accentStyle}
                >
                    {menu.map((item, i) => {
                        switch (item.type) {
                            case "item":
                                return (
                                    <Item key={item.name} asChild>
                                        {"href" in item ? (
                                            <LinkButton
                                                className="hover:bg-accent-500/20 active:bg-accent-500/40 pr-4"
                                                icon={item.icon}
                                                variant="transparent"
                                                href={item.href}
                                            >
                                                {item.name}
                                            </LinkButton>
                                        ) : (
                                            <Button
                                                className="hover:bg-accent-500/20 active:bg-accent-500/40 pr-4"
                                                variant="transparent"
                                                icon={item.icon}
                                                onClick={item.onClick}
                                            >
                                                {item.name}
                                            </Button>
                                        )}
                                    </Item>
                                )
                            case "separator":
                                return (
                                    <Separator
                                        key={i}
                                        className="-mx-1 my-1 h-[2px] bg-gray-700"
                                    />
                                )
                        }
                    })}
                </Content>
            </Portal>
        </Root>
    )
}
