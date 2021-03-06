import ColumnActionsHeaderRenderer from './ColumnActionsHeaderRenderer';
import React from 'react';

const connectHeader = ({ handleColumnChange, handleNumericSettings }) => {
    return columnsToSet => {
        return columnsToSet.map((c, i) => ({
            ...c,
            headerRenderer:
                <ColumnActionsHeaderRenderer 
                    column={c}
                    index={i}
                    onColumnChanged={handleColumnChange} 
                    handleNumericSettings={handleNumericSettings} 
                /> 
            })
        );
    }
};

export { connectHeader };