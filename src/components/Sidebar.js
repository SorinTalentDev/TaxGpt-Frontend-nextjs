import React, { useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import {useNavigate} from 'react-router-dom';
import "./../Asset/css/Sidebar.css";
import { Button } from "antd";
import { DashOutlined } from '@ant-design/icons';

function Navigation() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    // const goToPrompt = () => {
    //     navigate("/Prompt");
    // }
    const gotoDashboard = () => {
        navigate("/");
    }

    return (
        <div>
            {/* The Sidebar component now accepts a collapsed prop */}
            <Sidebar collapsed={collapsed} className="left-side">
                <div className="left-menu">
                    <main>
                        <Button  onClick={() => setCollapsed(!collapsed)}  className={`${collapsed ? "expand-btn" : "collapse-btn"}`}>
                            {collapsed ? <DashOutlined /> : "Menu"}
                        </Button>
                    </main>
                    {!collapsed && (
                        <Menu>
                            <MenuItem onClick={gotoDashboard}>Dashboard</MenuItem>
                            <MenuItem onClick={gotoDashboard}>Prompt</MenuItem>
                            <MenuItem>SetTeam</MenuItem>
                        </Menu>
                    )}
                </div>
            </Sidebar>
        </div>
    );
}

export default Navigation;