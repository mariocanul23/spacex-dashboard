function Pagination({ currentPage, totalPages, onPreviosPages, onNextPage}){

    return (
        <div className="pagination">
        <button disabled={currentPage === 1} onClick={onPreviosPages}> 
          Anterior
        </button>

        <span>Página {currentPage} de {totalPages} </span>

        <button disabled={currentPage === totalPages} onClick={onNextPage}>
          Siguiente
        </button>
      </div>
    );
}

export default Pagination;