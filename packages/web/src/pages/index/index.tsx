import { getEtfIndexList } from "@etf/api";
import { useRequest } from "ahooks";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { data } = useRequest(() => getEtfIndexList());
  return (
    <div className="flex flex-wrap gap-4">
      {data?.map((item) => (
        <div className="border" key={item.index}>
          <h2 className="font-bold">{item.index}</h2>
          <div className="flex gap-2 flex-wrap">
            {item.etfs.map((etf) => (
              <div
                key={etf.code}
                className="bg-black/20 p-2"
                onClick={() => {
                  navigate(`/${etf.code}`);
                }}
              >
                <p>{etf.code}</p>
                <p>{etf.name}</p>
                <p>{etf.gm}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;
