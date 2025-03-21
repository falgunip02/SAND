import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDrag } from 'react-dnd';
import './Email.css';
import { setFullNameData } from '../actions/fullNameActions';
import { v4 as uuidv4 } from 'uuid';

const Email = ({ fullNameDataList, setFullNameData, formField }) => {
  const [id] = useState(uuidv4()); // Generate a unique ID once

  const handleBlur = (event) => {
    if (event.target.value.trim()) {
      setFullNameData(id, event.target.value, 'Email');
    }
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: 'item',
    item: { id, type: 'Email', text: 'Email' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    console.log('Full Name Data List:', fullNameDataList);
  }, [fullNameDataList]);

  return (
    <div className="email-container" ref={dragRef}>
      <input
        type="email"
        name="emailTitle"
        className="email-title"
        placeholder={formField?.title || "Email"} // Use formField.title if available
        onBlur={handleBlur}
      />
      <input type="text" name="emailInput" className="email-input" />
    </div>
  );
};

const mapStateToProps = (state) => ({
  fullNameDataList: state.fullName.fullNameDataList,
});

const mapDispatchToProps = {
  setFullNameData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Email);
