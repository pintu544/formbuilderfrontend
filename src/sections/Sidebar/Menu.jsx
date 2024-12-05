/* eslint-disable react/prop-types */
const Menu = ({ children }) => {
  return (
    <div className="h-full px-3 py-4 overflow-y-auto">
      <ul className="space-y-2 font-medium">{children}</ul>
    </div>
  );
};

export default Menu;
