import Icon from "@/components/ui/Icon";

const QuoteActionButtons = ({ id, navigate }) => {
  return (
    <div className="flex space-x-2 rtl:space-x-reverse justify-center">
      <button
        className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700"
        type="button"
        title="Edit"
      >
        <Icon icon="ph:pencil-line" />
      </button>

      <button
        className="icon-btn hover:bg-blue-50 dark:hover:bg-blue-900"
        type="button"
        title="View"
        onClick={() => navigate(`/quote/view_quote_admin/${id}`)}
      >
        <Icon icon="ph:eye" />
      </button>

      <button
        className="icon-btn hover:bg-green-50 dark:hover:bg-green-900"
        type="button"
        title="Print"
      >
        <Icon icon="ph:printer" />
      </button>
      <button
        className="icon-btn hover:bg-red-50 dark:hover:bg-red-900"
        type="button"
        title="Delete"
      >
        <Icon icon="ph:trash" />
      </button>
      <button
        className="icon-btn hover:bg-indigo-50 dark:hover:bg-indigo-900"
        type="button"
        title="Schedule"
      >
        <Icon icon="ph:calendar-check" />
      </button>
    </div>
  );
};

export default QuoteActionButtons;
