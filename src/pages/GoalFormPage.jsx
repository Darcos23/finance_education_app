import { useNavigate } from "react-router-dom";

import GoalForm from "../components/goals/GoalForm";
import MobileShell from "../components/layout/MobileShell";
import TopBar from "../components/layout/TopBar";
import { useAppContext } from "../context/AppContext";

export default function GoalFormPage() {
    const navigate = useNavigate();
    const { user, refresh } = useAppContext();

    const onSaved = (goal) => {
        refresh();
        navigate(`/goals/${goal.id}`);
    };

    return (
        <MobileShell topBar={<TopBar title="Nueva meta" subtitle="Seguimiento financiero" />}>
            <GoalForm user={user} onSaved={onSaved} onCancel={() => navigate("/goals")} />
        </MobileShell>
    );
}
