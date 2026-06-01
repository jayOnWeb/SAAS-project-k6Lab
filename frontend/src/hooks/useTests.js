import { useState, useEffect } from "react";
import {
  getAllTests,
  deleteTest as deleteTestAPI,
} from "../services/testService";

const useTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all tests
  const fetchTests = async () => {
    try {
      setLoading(true);

      const res = await getAllTests(); // ✅ use res
      setTests(res.data); // ✅ correct

    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete test
  const deleteTest = async (id) => {
    try {
      await deleteTestAPI(id);
      setTests((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return {
    tests,
    loading,
    deleteTest,
    fetchTests,
  };
};

export default useTests;