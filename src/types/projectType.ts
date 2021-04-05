export interface ProjetItemContent {
    link: string
    label: string
}
export interface ProjectItemType {
    id: string
    name: string
    link: string
    type: string
    state: number
    content: ProjetItemContent[]
}
// 项目类型
export interface ProjectTypeItemType {
    value: string
    label: string
    list?: ProjectItemType[]
}

export interface EditProjectModalType {
    show?: boolean
    id?: string
    name?: string
    link?: string
    type?: string
    content?: ProjetItemContent[]
}

export interface EditProjectBody {
    id?: string
    name: string
    link: string
    type: string
    content: ProjetItemContent[]
}
