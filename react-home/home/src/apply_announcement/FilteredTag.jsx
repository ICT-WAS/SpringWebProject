

// CloseButton ?
export default function FilteredTag({filterName, handleClose}) {
    return (
        <>
        <span className='badge badge-custom'>
            {filterName}
            <button className='btn btn-no-bg' onClick={() => handleClose(filterName)}>x</button>
        </span>
        </>
    );
}