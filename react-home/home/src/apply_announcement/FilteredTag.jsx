
// CloseButton ?
export default function FilteredTag({filterName}) {
    return (
        <>
        <span className='badge badge-custom'>
            {filterName}
            <button className='btn btn-no-bg'>x</button>
        </span>
        </>
    );
}