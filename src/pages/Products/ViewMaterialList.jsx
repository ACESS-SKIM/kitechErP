import React, { useState, useEffect } from 'react';

import './CSS/sweetalert2.css';

export default function ViewMaterialListInProduct({ closeEvent, initialMaterialID, productId, partId }) {
  useEffect(() => {
    console.log('Product ID:', productId);
    console.log('Part ID:', partId);
  }, [productId, partId]);

  return (
    <div>
      ViewMaterialListInProduct Component
    </div>
  );
}
