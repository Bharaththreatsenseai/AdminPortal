import React, { useState } from "react";

function ListFetcher() {
  const [groups, setGroups] = useState([]);
  const [showGroups, setShowGroups] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [roles, setRoles] = useState([]); // all available roles
  const [roleToggleStates, setRoleToggleStates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Toggle groups list visibility and fetch groups if opening
  const handleToggleGroups = () => {
    if (showGroups) {
      setShowGroups(false);
      setOpenGroup(null);
      setRoles([]);
      setRoleToggleStates({});
      setError(null);
    } else {
      setLoading(true);
      fetch("http://localhost:3000/api/usergroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch groups");
          return res.json();
        })
        .then((json) => {
          setGroups(json);
          setShowGroups(true);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  // Fetch roles for a selected group and set toggle states
  const handleGroupClick = (groupName) => {
    if (openGroup === groupName) {
      setOpenGroup(null);
      setRoles([]);
      setRoleToggleStates({});
    } else {
      setOpenGroup(groupName);
      setLoading(true);
      fetch("http://localhost:3000/api/usergroup/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch roles");
          return res.json();
        })
        .then((json) => {
          const { roles, allRoles } = json;
          if (!Array.isArray(roles) || !Array.isArray(allRoles)) {
            throw new Error("Invalid roles response format");
          }

          setRoles(allRoles);
          const toggles = {};
          allRoles.forEach((role) => {
            toggles[role] = roles.includes(role);
          });
          setRoleToggleStates(toggles);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setRoles([]);
          setRoleToggleStates({});
          setLoading(false);
        });
    }
  };

  // Toggle a role's on/off state locally
  const toggleRole = (roleName) => {
    setRoleToggleStates((prev) => ({
      ...prev,
      [roleName]: !prev[roleName],
    }));
  };

  // Save updated roles back to backend
  const handleSaveChanges = () => {
    if (!openGroup) return alert("Select a group first");

    const updatedRoles = Object.entries(roleToggleStates)
      .filter(([_, isOn]) => isOn)
      .map(([role]) => role);

    fetch("http://localhost:3000/api/usergroup/roles/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupName: openGroup,
        roles: updatedRoles,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save roles");
        return res.json();
      })
      .then(() => {
        alert("Roles updated successfully");
      })
      .catch((err) => {
        alert("Error saving roles: " + err.message);
      });
  };

  return (
    <div>
      <button
        onClick={handleToggleGroups}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: showGroups ? "#007BFF" : "#EEE",
          color: showGroups ? "#FFF" : "#000",
          border: "none",
          borderRadius: "5px",
          marginBottom: "15px",
        }}
      >
        Groups
      </button>

      {showGroups && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {groups.map((group, i) => (
            <button
              key={i}
              onClick={() => handleGroupClick(group)}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor: openGroup === group ? "#28a745" : "#ddd",
                color: openGroup === group ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
              }}
            >
              {group}
            </button>
          ))}
        </div>
      )}

      {openGroup && roles.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div>
            Roles for <b>{openGroup}</b>:
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "8px",
              maxWidth: "300px",
            }}
          >
            {roles.map((role, i) => {
              const isOn = roleToggleStates[role] || false;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#f8f9fa",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>{role}</span>
                  <button
                    onClick={() => toggleRole(role)}
                    style={{
                      padding: "4px 12px",
                      backgroundColor: isOn ? "#198754" : "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    {isOn ? "ON" : "OFF"}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSaveChanges}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Save Changes
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

export default ListFetcher;
