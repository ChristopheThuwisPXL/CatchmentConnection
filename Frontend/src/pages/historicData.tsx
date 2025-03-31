import React from "react";
import "./history.css";

const HistoricData: React.FC = () => {
  return (
    <div id="Main">
        <aside id="Side" className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
            </ul>
        </aside>
        <main id="Body" className="main-content">
            <h1>Main Content</h1>
            <p>This is the main content area.</p>
        </main>
    </div>
  );
};

export default HistoricData;
