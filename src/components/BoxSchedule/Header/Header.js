
const Header = () => {
    const headers = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
        <tr>
            {headers.map((header, index) => (
                <th key={index}>{header}</th>
            ))}
        </tr>
    )
}

export default Header