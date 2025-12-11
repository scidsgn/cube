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
import { cx } from "@/app/cva.config"
import { Content, List, Root, Trigger } from "@radix-ui/react-tabs"
import { Children, ComponentProps, ReactElement, ReactNode } from "react"

type TabsProps = {
    children?: ReactNode
    listClassName?: string
} & Omit<ComponentProps<typeof Root>, "children">

export const Tabs = ({ children, listClassName, ...props }: TabsProps) => {
    const childElements = Children.toArray(children)

    const tabs = childElements.filter(
        (child) =>
            typeof child === "object" && "type" in child && child.type === Tab,
    ) as ReactElement<TabProps, typeof Tab>[]

    return (
        <Root {...props}>
            <List className={cx("sticky top-0 z-10 flex gap-1", listClassName)}>
                {tabs.map((tab) => (
                    <Trigger
                        key={tab.props.value}
                        value={tab.props.value}
                        className="group data-[state=active]:border-accent-600 relative border-b-2 border-transparent px-3 py-1 text-lg font-semibold hover:bg-gray-50/8 active:bg-gray-50/15"
                    >
                        <span className="invisible">{tab.props.button}</span>
                        <span className="absolute inset-0 grid place-items-center font-medium text-gray-300 group-data-[state=active]:font-semibold group-data-[state=active]:text-gray-50">
                            {tab.props.button}
                        </span>
                    </Trigger>
                ))}
            </List>
            {tabs.map((tab) => (
                <Content key={tab.props.value} value={tab.props.value}>
                    {tab.props.children}
                </Content>
            ))}
        </Root>
    )
}

type TabProps = {
    value: string
    button: ReactNode
    children: ReactNode
}

export const Tab = (props: TabProps) => null
