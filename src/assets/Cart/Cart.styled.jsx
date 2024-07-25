import styled from "styled-components";

export const Title = styled.h1`
  margin-top: 60px;
  text-align: center;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.87);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 3rem 0;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 450px;
  

`;

export const Total = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin: 10px 0;
  width: 100%;
  text-align: right;
`;

export const SubTotal = styled.div`
  font-size: 1.2rem;
  color: #666;
  width: 100%;
  text-align: right;
`;

export const FinalTotal = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #000;
  margin-top: 15px;
  width: 100%;
  text-align: right;
  border-top: 1px solid #ddd;
  padding-top: 10px;
`;

export const SummaryTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #444;
`;
