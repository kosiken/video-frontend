import React from 'react'
import User from '../models/User'


type LayoutProps = {
    children: any;
    user?: User;
    showHeader?: boolean
}
const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="layout">
            {children}
        </div>
    )
}

export default Layout
