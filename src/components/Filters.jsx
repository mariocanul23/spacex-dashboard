function Filters({ nameFilter, dateFilter, onNameChange, onDateChange, onClear}){
    return(
        <section className="filters">
            <input 
                type="text" 
                placeholder="Buscar por nombre..."
                value={nameFilter}
                onChange={(event) => onNameChange(event.target.value)}
            />

            <input 
                type="date"
                value={dateFilter}
                onChange={(event) => onDateChange(event.target.value)} 
            />

            <button onClick={onClear}>Limpiar</button>
        </section>
    );
}

export default Filters;