import React from 'react';

export default function Favourites({ favorites = [], onRemove }) {
  return (
    <div>
      <h2>Your Favourites</h2>
      {favorites.length === 0 ? (
        <p>No favourites added yet.</p>
      ) : (
        <ul>
          {favorites.map((item) => (
            <li key={item.id}>
              <span>{item.name} - ${item.price}</span>
              <button onClick={() => onRemove && onRemove(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}